import { Body, Controller, Post } from "@nestjs/common";

import { SubmitContactDto } from "./dto/submit-contact.dto";
import { ContactService } from "./contact.service";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  submitContactForm(@Body() dto: SubmitContactDto) {
    return this.contactService.submitContactForm(dto);
  }
}
