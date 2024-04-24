export interface Graph {

    /**
     * The email the user used to register his account
     */
    email?: string;

    name: string;
    status?: "Happy" | "Sad";
    phoneNumbers: string[];
}