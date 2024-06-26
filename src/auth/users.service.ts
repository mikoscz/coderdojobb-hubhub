import { users } from "../drizzle/schema";
import { Database } from "../common";
import { InferInsertModel, InferSelectModel, eq } from "drizzle-orm";
import { MailerService } from "../common/mailer";
import { v4 as uuid } from "uuid";
import crypto from "node:crypto";


export class UsersService {
  constructor(
    private readonly db: Database,
    private readonly mailerService: MailerService
  ) { }

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
    //console.log(user);
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

  async register(data: { email: string; password: string }) {
    const { hash: hashedPassword, salt: saltPassword } = hashPassword(data.password)
    const user = await this.createUser({
      id: uuid(),
      email: data.email,
      firstName: "aa",
      lastName: "bb",
      hashedPassword,
      saltPassword,
    });

    await this.mailerService.sendEmail({
      to: data.email,
      subject: "Welcome to HubHub!",
      text: "Welcome to HubHub! We're excited to have you on board.",
    });

    return user;
  }
}

const config = {
  // size of the generated hash
  hashBytes: 32,
  // larger salt means hashed passwords are more resistant to rainbow table, but
  // you get diminishing returns pretty fast
  saltBytes: 16,
  // more iterations means an attacker has to take longer to brute force an
  // individual password, so larger is better. however, larger also means longer
  // to hash the password. tune so that hashing the password takes about a
  // second
  iterations: 872791,
  digest: "sha512"
};



function hashPassword(password: string) {
  const { iterations, hashBytes, digest, saltBytes } = config;
  const salt = crypto.randomBytes(saltBytes).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, hashBytes, digest)
    .toString("hex");
  return { salt, hash };
}
