import { OrderItemResponse } from "./order-item-response";

export interface OrderResponse {
    orderID: string;
    userID: string;
    orderDate: Date;
    totalBill: number;
    username: string;
    email: string;
    orderItems: OrderItemResponse[];
}
