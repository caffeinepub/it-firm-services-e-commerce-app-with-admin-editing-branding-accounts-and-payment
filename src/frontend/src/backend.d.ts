import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    description: string;
    imageUrl?: string;
    category: string;
    price: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface OrderItem {
    id: bigint;
    status: string;
    totalAmount: bigint;
    timestamp: bigint;
    customerId: Principal;
    orderedProducts: Array<Product>;
}
export interface SocialLinks {
    whatsapp: string;
    facebook: string;
    youtube: string;
}
export interface Language {
    code: string;
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface LanguageConfig {
    defaultLanguage: string;
    availableLanguages: Array<Language>;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface SiteBranding {
    socialLinks: SocialLinks;
    logo?: string;
    languageConfig: LanguageConfig;
    storeBanners: Array<string>;
    homepageSliderImages: Array<string>;
}
export interface ServiceItem {
    id: bigint;
    title: string;
    description: string;
    pricing?: bigint;
    imageUrl?: string;
    category: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(orderedProducts: Array<Product>, totalAmount: bigint): Promise<bigint>;
    createProduct(product: Product): Promise<bigint>;
    createService(service: ServiceItem): Promise<bigint>;
    getAllOrders(): Promise<Array<OrderItem>>;
    getCallerOrders(): Promise<Array<OrderItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProducts(): Promise<Array<Product>>;
    getServices(): Promise<Array<ServiceItem>>;
    getSiteBranding(): Promise<SiteBranding>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(config: StripeConfiguration): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBranding(branding: SiteBranding): Promise<void>;
}
