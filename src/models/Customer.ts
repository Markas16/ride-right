// Domain Model: Customer
// Encapsulates customer data with private fields and getter/setter methods

import type { Profile } from "@/types/rental";

export class CustomerModel {
  private _id: string;
  private _userId: string;
  private _fullName: string;
  private _phone: string | null;
  private _createdAt: string;
  private _updatedAt: string;

  constructor(profile: Profile) {
    this._id = profile.id;
    this._userId = profile.user_id;
    this._fullName = profile.full_name;
    this._phone = profile.phone;
    this._createdAt = profile.created_at;
    this._updatedAt = profile.updated_at;
  }

  // Getters
  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get fullName(): string { return this._fullName; }
  get phone(): string | null { return this._phone; }
  get createdAt(): string { return this._createdAt; }
  get updatedAt(): string { return this._updatedAt; }

  // Setters
  set fullName(name: string) { this._fullName = name; }
  set phone(phone: string | null) { this._phone = phone; }

  // Domain methods
  getDisplayName(): string {
    return this._fullName || "Unknown User";
  }

  toJSON() {
    return {
      id: this._id,
      user_id: this._userId,
      full_name: this._fullName,
      phone: this._phone,
    };
  }
}
