import AppDataSource from "@config/database/typeorm";
import { User } from "@entities/user.entity";
import { Repository } from "typeorm";
import { RegisterInput, UpdateProfileInput } from "./user.input";
import { generateAccessToken, generateRefreshToken } from "@utils/jwt";
import * as bcrypt from "bcryptjs";

const pepper = process.env.PASSWORD_HASHING_PEPPER || "defaultPepper";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async register(
    data: RegisterInput
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const user = this.userRepository.create({
      email: data.email,
      hashed_password: data.password, // This will be hashed by the BeforeInsert hook
      name: data.name,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const userPayload = {
      userId: savedUser.user_id,
      username: savedUser.email,
      isAdmin: savedUser.is_admin,
    };

    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    return {
      user: savedUser,
      accessToken,
      refreshToken,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const userPayload = {
      userId: user.user_id,
      username: user.email,
      isAdmin: user.is_admin,
    };

    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async findByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_id: userId } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<User | null> {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new Error("Email is already taken");
      }
    }

    await this.userRepository.update({ user_id: userId }, data);
    return this.findByUserId(userId);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = process.env.PASSWORD_HASHING_SALT || 10;
    const hashedPassword = await bcrypt.hash(newPassword + pepper, salt);

    await this.userRepository.update(
      { user_id: userId },
      { hashed_password: hashedPassword }
    );
    return true;
  }

  async deleteAccount(userId: string): Promise<boolean> {
    const result = await this.userRepository.delete({ user_id: userId });
    return (
      result.affected !== undefined &&
      result.affected !== null &&
      result.affected > 0
    );
  }
}
