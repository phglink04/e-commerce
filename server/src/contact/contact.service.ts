import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { MailService } from "../mail/mail.service";
import { SubmitContactDto } from "./dto/submit-contact.dto";
import { Contact, ContactDocument } from "./schemas/contact.schema";

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
    private readonly mailService: MailService,
  ) {}

  async submitContactForm(dto: SubmitContactDto) {
    const newEntry = await this.contactModel.create(dto);

    const emailMessage = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.6;">
        <p>Hi <strong>${dto.name}</strong>,</p>
        <p>Thank you for reaching out to us at <span style="color: green; font-weight: bold;">PlantWorld</span>.</p>
        <p>We have received your message and our team is currently reviewing it.</p>
        <p><strong>Here is a copy of your message:</strong></p>
        <hr />
        <p style="font-style: italic;">${dto.message}</p>
        <hr />
        <p>With green regards,<br /><strong>The PlantWorld Team</strong></p>
      </div>
    `;

    await this.mailService.sendEmail({
      email: dto.email,
      subject: "Your message has been received by PlantWorld",
      message: emailMessage,
    });

    return {
      status: "success",
      message:
        "Your message was submitted successfully. A confirmation email has been sent.",
      data: {
        contact: newEntry,
      },
    };
  }
}
