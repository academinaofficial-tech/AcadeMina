import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
    return (
        <main className="flex justify-center items-center min-h-[80vh] pt-[100px] pb-[60px]">
            <SignUp routing="path" path="/account/signup" signInUrl="/account/login" />
        </main>
    );
}
