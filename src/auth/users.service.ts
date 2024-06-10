import { users } from "../drizzle/schema";
import { Database } from "../common";
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";
import { MailerService } from "../common/mailer";
import { v4 as uuid } from "uuid";


export class UsersService {
  constructor(
    private readonly db: Database,
    private readonly mailerService: MailerService
  ) {}

  async getAllUsers() {
    return this.db.select().from(users);
  }

  async getUserById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return null;
    }

    return user;
  }

  async deleteUserById(id: string) {
    return this.db.delete(users).where(eq(users.id, id));
  }

  async createUser(
    user: InferInsertModel<typeof users>
  ): Promise<InferSelectModel<typeof users>> {
    console.log(user)
    const [newUser] = await this.db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(
    id: string,
    updateData: {
      email: string;
      firstName: string;
      lastName: string;
    }
  ) {
    const [user] = await this.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!user) {
      return null;
    }

    return user;
  }


  async register(data: { email: string, password: string }) {
    console.log(data)
   await this.createUser({
      id: uuid(),
      email: data.email,
      firstName:"aa",
      lastName: "bb",
      hashedPassword: data.password,
      saltPassword: "ala",
    })
   await this.mailerService.sendEmail({
      to: data.email,
      subject: "Welcome to HubHub!",
      text: "Welcome to HubHub! We're excited to have you on board.",
    });
  }
}
