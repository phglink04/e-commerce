import { NestFactory } from "@nestjs/core";
import { getModelToken } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Model, Types } from "mongoose";

import { AppModule } from "../app.module";
import { Role } from "../common/constants/roles.constant";
import { PaymentMethod, PaymentStatus } from "../common/enums/payment.enum";
import { Order, OrderDocument } from "../orders/schemas/order.schema";
import { Plant, PlantDocument } from "../plants/schemas/plant.schema";
import { User, UserDocument } from "../users/schemas/user.schema";

type SeedUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: Role;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  cart: [];
  orders: Types.ObjectId[];
};

type SeedPlant = {
  _id: Types.ObjectId;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  category: string;
  tag: string;
  quantity: number;
  availability: "In Stock" | "Out Of Stock" | "Up Coming";
  color: string[];
  imageCover: string;
  plantCareTips: string[];
  images: string[];
};

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn", "log"],
  });

  try {
    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    const plantModel = app.get<Model<PlantDocument>>(getModelToken(Plant.name));
    const orderModel = app.get<Model<OrderDocument>>(getModelToken(Order.name));

    console.log("[seed] Cleaning existing data...");
    await Promise.all([
      orderModel.deleteMany({}),
      plantModel.deleteMany({}),
      userModel.deleteMany({}),
    ]);

    const hashedPassword = await bcrypt.hash("password123", 12);

    const users: SeedUser[] = [
      {
        _id: new Types.ObjectId(),
        name: "Admin PlantWorld",
        email: "admin@plantworld.vn",
        role: Role.ADMIN,
        phoneNumber: "0901000001",
        password: hashedPassword,
        passwordConfirm: hashedPassword,
        cart: [],
        orders: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Shipper PlantWorld",
        email: "delivery@plantworld.vn",
        role: Role.DELIVERY_PARTNER,
        phoneNumber: "0901000002",
        password: hashedPassword,
        passwordConfirm: hashedPassword,
        cart: [],
        orders: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Nguyen Van A",
        email: "user@plantworld.vn",
        role: Role.USER,
        phoneNumber: "0901000003",
        password: hashedPassword,
        passwordConfirm: hashedPassword,
        cart: [],
        orders: [],
      },
    ];

    console.log("[seed] Creating users...");
    await userModel.insertMany(users, { ordered: true });

    const plants: SeedPlant[] = [
      {
        _id: new Types.ObjectId(),
        name: "Cay Luoi Ho",
        price: 180000,
        shortDescription: "Cay loc khong khi, de cham soc",
        description:
          "Luoi Ho la loai cay noi that pho bien, co kha nang thanh loc khong khi va thich hop de ban lam viec.",
        category: "Indoor",
        tag: "Air Purifying",
        quantity: 80,
        availability: "In Stock",
        color: ["Green", "Yellow"],
        imageCover: "plants/luoi-ho.jpg",
        plantCareTips: [
          "Tuoi 1-2 lan/tuần",
          "Dat o noi co anh sang gian tiep",
          "Khong de dong nuoc o chau",
        ],
        images: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Cay Kim Tien",
        price: 350000,
        shortDescription: "Cay phong thuy tai loc",
        description:
          "Kim Tien duoc ua chuong trong van phong va nha o vi y nghia tai loc, sinh truong ben bi.",
        category: "Indoor",
        tag: "Feng Shui",
        quantity: 60,
        availability: "In Stock",
        color: ["Green"],
        imageCover: "plants/kim-tien.jpg",
        plantCareTips: [
          "Tuoi khi dat kho",
          "Uu tien anh sang vua phai",
          "Lau la dinh ky",
        ],
        images: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Cay Truc May Man",
        price: 220000,
        shortDescription: "Mang lai may man va sinh khi",
        description:
          "Truc May Man thuong duoc trung thuy sinh, de ban va de cham trong moi truong trong nha.",
        category: "Indoor",
        tag: "Lucky",
        quantity: 70,
        availability: "In Stock",
        color: ["Green"],
        imageCover: "plants/truc-may-man.jpg",
        plantCareTips: [
          "Thay nuoc moi 7 ngay",
          "Dat noi thoang mat",
          "Cat bo la vang",
        ],
        images: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Cay Monstera",
        price: 420000,
        shortDescription: "La xe dep, phu hop trang tri",
        description:
          "Monstera co la lon, hinh dang doc dao, giup khong gian hien dai va xanh mat hon.",
        category: "Indoor",
        tag: "Decor",
        quantity: 40,
        availability: "In Stock",
        color: ["Green"],
        imageCover: "plants/monstera.jpg",
        plantCareTips: [
          "Tuoi 2-3 lan/tuần",
          "Dat noi co do am cao",
          "Bo sung phan huu co hang thang",
        ],
        images: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Cay Lan Y",
        price: 260000,
        shortDescription: "Hoa dep, thanh loc khong khi",
        description:
          "Lan Y la loai cay canh co hoa trang, de trong trong nha va giup giam bui min.",
        category: "Indoor",
        tag: "Flowering",
        quantity: 55,
        availability: "In Stock",
        color: ["Green", "White"],
        imageCover: "plants/lan-y.jpg",
        plantCareTips: [
          "Giu dat am nhe",
          "Tranh nang gat truc tiep",
          "Cat tia hoa tan",
        ],
        images: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Cay Phat Tai",
        price: 390000,
        shortDescription: "Cay phong thuy pho bien",
        description:
          "Phat Tai co than go dep, thuong dat o phong khach hoac sanh cong ty de tao diem nhan.",
        category: "Indoor",
        tag: "Feng Shui",
        quantity: 35,
        availability: "In Stock",
        color: ["Green"],
        imageCover: "plants/phat-tai.jpg",
        plantCareTips: [
          "Tuoi dinh ky 2 lan/tuần",
          "Dat o noi co anh sang tu nhien",
          "Trai dat thoat nuoc tot",
        ],
        images: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Cay Sen Da",
        price: 95000,
        shortDescription: "Nho gon, de cham soc",
        description:
          "Sen Da phu hop de ban hoc, ban lam viec, da dang mau sac va hinh dang.",
        category: "Succulent",
        tag: "Mini",
        quantity: 120,
        availability: "In Stock",
        color: ["Green", "Purple"],
        imageCover: "plants/sen-da.jpg",
        plantCareTips: [
          "Tuoi rat it",
          "Can nhieu anh sang",
          "Tránh mua truc tiep qua nhieu",
        ],
        images: [],
      },
      {
        _id: new Types.ObjectId(),
        name: "Cay Xuong Rong Tai Tho",
        price: 130000,
        shortDescription: "Cay mini doc dao",
        description:
          "Xuong Rong Tai Tho co hinh dang nhu tai tho, thich hop trang tri ban lam viec va cua so.",
        category: "Succulent",
        tag: "Mini",
        quantity: 100,
        availability: "In Stock",
        color: ["Green"],
        imageCover: "plants/xuong-rong-tai-tho.jpg",
        plantCareTips: [
          "Tuoi 5-7 ngay/lần",
          "Dat noi co nang nhe buoi sang",
          "Khong tuoi vao ban dem",
        ],
        images: [],
      },
    ];

    console.log("[seed] Creating plants...");
    await plantModel.insertMany(plants, { ordered: true });

    const customerUser = users[2];
    const now = Date.now();

    const orderPayloads = [
      {
        _id: new Types.ObjectId(),
        user: customerUser._id,
        items: [
          {
            plantId: plants[0]._id,
            quantity: 2,
            price: plants[0].price,
            total: plants[0].price * 2,
          },
          {
            plantId: plants[1]._id,
            quantity: 1,
            price: plants[1].price,
            total: plants[1].price,
          },
        ],
        totalPrice: plants[0].price * 2 + plants[1].price,
        orderTotal: plants[0].price * 2 + plants[1].price,
        paymentId: "CASH-ORDER-001",
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.PAID,
        referenceCode: "PLWSEED001",
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
        expectedDelivery: new Date(now + 2 * 24 * 60 * 60 * 1000),
        status: [{ stage: "Order Received", changedAt: new Date() }],
        firstName: "Van",
        lastName: "A",
        mobile: customerUser.phoneNumber,
        email: customerUser.email,
        addressLine1: "12 Nguyen Trai",
        addressLine2: "P. Ben Thanh",
        area: "Quan 1",
        city: "TP. Ho Chi Minh",
        state: "Ho Chi Minh",
        pincode: "700000",
      },
      {
        _id: new Types.ObjectId(),
        user: customerUser._id,
        items: [
          {
            plantId: plants[3]._id,
            quantity: 1,
            price: plants[3].price,
            total: plants[3].price,
          },
          {
            plantId: plants[4]._id,
            quantity: 2,
            price: plants[4].price,
            total: plants[4].price * 2,
          },
        ],
        totalPrice: plants[3].price + plants[4].price * 2,
        orderTotal: plants[3].price + plants[4].price * 2,
        paymentId: "BANK-ORDER-002",
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentStatus: PaymentStatus.PENDING,
        referenceCode: "PLWSEED002",
        createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000),
        expectedDelivery: new Date(now + 3 * 24 * 60 * 60 * 1000),
        status: [{ stage: "Order Received", changedAt: new Date() }],
        firstName: "Van",
        lastName: "A",
        mobile: customerUser.phoneNumber,
        email: customerUser.email,
        addressLine1: "12 Nguyen Trai",
        addressLine2: "P. Ben Thanh",
        area: "Quan 1",
        city: "TP. Ho Chi Minh",
        state: "Ho Chi Minh",
        pincode: "700000",
      },
      {
        _id: new Types.ObjectId(),
        user: customerUser._id,
        items: [
          {
            plantId: plants[6]._id,
            quantity: 3,
            price: plants[6].price,
            total: plants[6].price * 3,
          },
          {
            plantId: plants[7]._id,
            quantity: 2,
            price: plants[7].price,
            total: plants[7].price * 2,
          },
        ],
        totalPrice: plants[6].price * 3 + plants[7].price * 2,
        orderTotal: plants[6].price * 3 + plants[7].price * 2,
        paymentId: "BANK-ORDER-003",
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentStatus: PaymentStatus.PAID,
        referenceCode: "PLWSEED003",
        createdAt: new Date(now),
        expectedDelivery: new Date(now + 5 * 24 * 60 * 60 * 1000),
        status: [
          { stage: "Order Received", changedAt: new Date(now) },
          {
            stage: "Order Shipped",
            changedAt: new Date(now + 2 * 60 * 60 * 1000),
          },
        ],
        firstName: "Van",
        lastName: "A",
        mobile: customerUser.phoneNumber,
        email: customerUser.email,
        addressLine1: "12 Nguyen Trai",
        addressLine2: "P. Ben Thanh",
        area: "Quan 1",
        city: "TP. Ho Chi Minh",
        state: "Ho Chi Minh",
        pincode: "700000",
      },
    ];

    console.log("[seed] Creating orders...");
    const orders = await orderModel.insertMany(orderPayloads, {
      ordered: true,
    });

    await userModel.updateOne(
      { _id: customerUser._id },
      { $set: { orders: orders.map((order) => order._id as Types.ObjectId) } },
    );

    console.log("[seed] Done.");
    console.log(`[seed] Users: ${users.length}`);
    console.log(`[seed] Plants: ${plants.length}`);
    console.log(`[seed] Orders: ${orders.length}`);
  } finally {
    await app.close();
  }
}

void seed()
  .then(() => {
    process.exitCode = 0;
  })
  .catch((error) => {
    console.error("[seed] Failed:", error);
    process.exitCode = 1;
  });
