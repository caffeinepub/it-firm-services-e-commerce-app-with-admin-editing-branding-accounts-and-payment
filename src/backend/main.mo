import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Stripe "stripe/stripe";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import OutCall "http-outcalls/outcall";



actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type ServiceItem = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    pricing : ?Nat;
    imageUrl : ?Text;
  };

  module ServiceItem {
    public func compareById(item1 : ServiceItem, item2 : ServiceItem) : Order.Order {
      Nat.compare(item1.id, item2.id);
    };
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    imageUrl : ?Text;
  };

  module Product {
    public func compareById(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  public type OrderItem = {
    id : Nat;
    customerId : Principal;
    orderedProducts : [Product];
    totalAmount : Nat;
    status : Text;
    timestamp : Int;
  };

  module OrderItem {
    public func compareById(order1 : OrderItem, order2 : OrderItem) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };
  };

  public type SocialLinks = {
    facebook : Text;
    whatsapp : Text;
    youtube : Text;
  };

  public type Language = {
    code : Text;
    name : Text;
  };

  public type LanguageConfig = {
    availableLanguages : [Language];
    defaultLanguage : Text;
  };

  public type SiteBranding = {
    logo : ?Text;
    homepageSliderImages : [Text];
    storeBanners : [Text];
    socialLinks : SocialLinks;
    languageConfig : LanguageConfig;
  };

  public type UserProfile = {
    name : Text;
  };

  let serviceItems = Map.empty<Nat, ServiceItem>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, OrderItem>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var siteBranding : SiteBranding = {
    // Default configuration with popular languages
    logo = null;
    homepageSliderImages = [];
    storeBanners = [];
    socialLinks = {
      facebook = "https://facebook.com";
      whatsapp = "https://wa.me/+1234567890";
      youtube = "https://youtube.com";
    };
    languageConfig = {
      availableLanguages = [
        { code = "en"; name = "English" },
        { code = "de"; name = "Deutsch" },
        { code = "es"; name = "Español" },
        { code = "fr"; name = "Français" },
        { code = "zh"; name = "中文" },
        { code = "ar"; name = "عربي" },
      ];
      defaultLanguage = "en";
    };
  };

  var nextServiceId = 1;
  var nextProductId = 1;
  var nextOrderId = 1;
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func initialize(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize Stripe configuration");
    };
    stripeConfig := ?config;
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  // Public catalog queries - accessible to everyone including guests
  public query ({ caller }) func getServices() : async [ServiceItem] {
    serviceItems.values().toArray().sort(ServiceItem.compareById);
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort(Product.compareById);
  };

  public query ({ caller }) func getSiteBranding() : async SiteBranding {
    siteBranding;
  };

  // Admin-only service management
  public shared ({ caller }) func createService(service : ServiceItem) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create services");
    };
    let newService = {
      service with id = nextServiceId;
    };
    serviceItems.add(nextServiceId, newService);
    nextServiceId += 1;
    newService.id;
  };

  // Admin-only product management
  public shared ({ caller }) func createProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let newProduct = {
      product with id = nextProductId;
    };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct.id;
  };

  // Admin-only branding management
  public shared ({ caller }) func updateBranding(branding : SiteBranding) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update branding");
    };
    siteBranding := branding;
  };

  // Order creation - uses caller as customer (security fix)
  public shared ({ caller }) func createOrder(orderedProducts : [Product], totalAmount : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    let newOrder : OrderItem = {
      id = nextOrderId;
      customerId = caller;
      orderedProducts;
      totalAmount;
      status = "pending";
      timestamp = 0;
    };
    orders.add(nextOrderId, newOrder);
    nextOrderId += 1;
    newOrder.id;
  };

  // Query orders - users see their own, admins see all
  public query ({ caller }) func getCallerOrders() : async [OrderItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    orders.values().toArray().filter(func(order : OrderItem) : Bool { order.customerId == caller }).sort(OrderItem.compareById);
  };

  public query ({ caller }) func getAllOrders() : async [OrderItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort(OrderItem.compareById);
  };

  // Admin-only Stripe configuration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe config");
    };
    stripeConfig := ?config;
  };

  // Transform function for HTTP outcalls
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Checkout session creation - requires user authentication
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    let config = switch (stripeConfig) {
      case (?c) { c };
      case (null) { Runtime.trap("Stripe needs to be first configured") };
    };
    await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
  };

  // Session status check - requires authentication (user or admin)
  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check session status");
    };
    let config = switch (stripeConfig) {
      case (?c) { c };
      case (null) { Runtime.trap("Stripe needs to be first configured") };
    };
    await Stripe.getSessionStatus(config, sessionId, transform);
  };
};
