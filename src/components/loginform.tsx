import { useState } from 'react';

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
        {isLogin && (
            <h1>a</h1>
        )}
        </>
    )
}