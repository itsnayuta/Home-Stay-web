// tests/firebase/authentication.test.js
import { auth } from "../../../backend/config/firebaseDb.js";
import { logIn, signUp } from "../../../backend/firebase/authentication.js";

import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

import { createUser } from "../../../backend/firebase/firestore/users.firestore.js";
// Mock tất cả các function Firebase
jest.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: jest.fn(),
    updateProfile: jest.fn(),
    sendEmailVerification: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("../../../backend/firebase/firestore/users.firestore.js", () => ({
    createUser: jest.fn(),
}));

jest.mock("../../../backend/config/firebaseDb.js", () => ({
    auth: {},
}));

describe("Authentication Service", () => {
    describe("logIn()", () => {
        it("should login successfully with correct credentials", async () => {
        const mockCredential = { user: { uid: "123", email: "test@mail.com" } };
        signInWithEmailAndPassword.mockResolvedValue(mockCredential);

        const result = await logIn("test@mail.com", "password123");
        expect(result).toEqual(mockCredential);
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            auth,
            "test@mail.com",
            "password123"
        );
        });

        it("should throw error if login fails", async () => {
        signInWithEmailAndPassword.mockRejectedValue(
            new Error("Invalid credentials")
        );

        await expect(logIn("wrong@mail.com", "wrongpass")).rejects.toThrow(
            "Invalid credentials"
        );
        });
    });

    describe("signUp()", () => {
        const metadata = {
        name: "Test User",
        phone: "0123456789",
        roles: ["USER"],
        };

        it("should sign up a new user successfully", async () => {
        const mockUser = { uid: "abc", email: "new@mail.com" };
        const mockUserCredential = { user: mockUser };

        createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
        updateProfile.mockResolvedValue();
        createUser.mockResolvedValue();
        sendEmailVerification.mockResolvedValue();

        await signUp("new@mail.com", "securePass", metadata);

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            auth,
            "new@mail.com",
            "securePass"
        );
        expect(updateProfile).toHaveBeenCalledWith(mockUser, {
            displayName: metadata.name,
        });
        expect(createUser).toHaveBeenCalledWith(
            mockUser,
            expect.objectContaining({ phone: metadata.phone })
        );
        expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
        });

        it("should throw error if Firebase fails to create user", async () => {
        createUserWithEmailAndPassword.mockRejectedValue(
            new Error("Email exists")
        );

        await expect(signUp("exist@mail.com", "pass", metadata)).rejects.toThrow(
            "Email exists"
        );
        });

        it("should throw error if updateProfile fails", async () => {
        const mockUser = { uid: "abc", email: "new@mail.com" };
        const mockUserCredential = { user: mockUser };

        createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
        updateProfile.mockRejectedValue(new Error("Failed to update profile"));

        await expect(signUp("new@mail.com", "pass", metadata)).rejects.toThrow(
            "Failed to update profile"
        );
        });
    });
});
