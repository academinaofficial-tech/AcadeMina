import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <main className="flex justify-center items-center min-h-[80vh] pt-[100px] pb-[60px]">
            <SignIn routing="path" path="/account/login" signUpUrl="/account/signup" />
        </main>
    );
}
