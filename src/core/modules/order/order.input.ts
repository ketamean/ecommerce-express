import { InputType, Field, registerEnumType } from "type-graphql";

export enum PaymentMethod {
  COD = "COD",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PAYPAL = "PAYPAL",
  BANK_TRANSFER = "BANK_TRANSFER",
}

registerEnumType(PaymentMethod, {
  name: "PaymentMethod",
  description: "Available payment methods",
});

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

registerEnumType(OrderStatus, {
  name: "OrderStatus",
  description: "Order status values",
});

@InputType()
export class CreateOrderInput {
  @Field()
  shipping_address!: string;

  @Field(() => PaymentMethod, { defaultValue: PaymentMethod.COD })
  payment_method!: PaymentMethod;

  @Field({ nullable: true })
  payment_gateway_id?: string; // For future payment gateway integration
}
