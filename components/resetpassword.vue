<template>
    <div class="reset-container">
        <div class="reset-card">
            <h2 v-if="step === 1">Forgot Password?</h2>
            <h2 v-else-if="step === 2">Enter Verification Code</h2>
            <h2 v-else>Set New Password</h2>

            <form v-if="step === 1" @submit.prevent="sendVerificationCode">
                <p>Enter your email address to receive a verification code.</p>
                <div class="input-group">
                    <label :class="{ active: email || emailFocused }" for="email">Email Address</label>
                    <input type="email" id="email" v-model="email" @focus="emailFocused = true"
                        @blur="emailFocused = false" required />
                </div>
                <button type="submit">Send Code</button>
            </form>

            <form v-else-if="step === 2" @submit.prevent="verifyCode">
                <p>A verification code has been sent to your email. Please enter it below.</p>
                <div class="input-group">
                    <label :class="{ active: code || codeFocused }" for="code">Verification Code</label>
                    <input type="text" id="code" v-model="code" @focus="codeFocused = true" @blur="codeFocused = false"
                        required />
                </div>
                <button type="submit">Verify Code</button>
                <button type="button" @click="step = 1" class="secondary-btn">Resend Code</button>
            </form>

            <form v-else-if="step === 3" @submit.prevent="resetPassword">
                <p>Enter a new password for your account.</p>
                <div class="input-group">
                    <label :class="{ active: password || passwordFocused }" for="password">New Password</label>
                    <input type="password" id="password" v-model="password" @focus="passwordFocused = true"
                        @blur="passwordFocused = false" required />
                </div>
                <button type="submit">Reset Password</button>
            </form>

            <NuxtLink to="/login" class="back-link">Back to Login</NuxtLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const step = ref(1);
const email = ref('');
const emailFocused = ref(false);
const code = ref('');
const codeFocused = ref(false);
const password = ref('');
const passwordFocused = ref(false);
const tempToken = ref('');
const verificationCode = ref('');

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationCode = async () => {
    try {
        verificationCode.value = generateVerificationCode();
        alert(`A verification code has been sent to your email: ${verificationCode.value}`);
        tempToken.value = 'dummy-token';
        step.value = 2;
    } catch (error) {
        console.error('Error sending verification code:', error);
        alert('An error occurred. Please try again.');
    }
};

const verifyCode = async () => {
    try {
        if (code.value === verificationCode.value) {
            alert('Code verified successfully. You can now set a new password.');
            step.value = 3;
        } else {
            alert('Invalid code. Please try again.');
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        alert('Invalid code. Please try again.');
    }
};

const resetPassword = async () => {
    try {
        alert('Your password has been reset. You can now log in.');
        step.value = 1;
    } catch (error) {
        console.error('Error resetting password:', error);
        alert('An error occurred. Please try again.');
    }
};
</script>

<style scoped>
.reset-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 25px auto 0 auto;
    width: 800px;  
    height: calc(100vh - 230px);
}

.reset-card {
    background: linear-gradient(0deg, rgb(0, 0, 0) 10%, rgba(255, 117, 37, 0.12) 100%);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 500px;
}

.input-group {
    position: relative;
    margin-bottom: 20px;
}

.input-group label {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    font-size: 16px;
    color: #aaa;
    transition: all 0.3s ease;
    pointer-events: none;
}

.input-group input:focus+label,
.input-group label.active {
    top: -5px;
    font-size: 14px;
}

.input-group input {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: none;
    border-bottom: 2px solid #555;
    background: transparent;
    color: white;
    outline: none;
    transition: border-color 0.3s ease;
}

.input-group input:focus {
    border-bottom: 2px solid rgba(221, 101, 32, 1);
}

button {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

button:hover {
    background-color: #3498db;
}

.secondary-btn {
    margin-top: 10px;
    background-color: transparent;
    color: #aaa;
    border: none;
    cursor: pointer;
    text-decoration: underline;
}

.secondary-btn:hover {
    color: white;
}

.back-link {
    display: block;
    margin-top: 15px;
    font-size: 14px;
    color: #aaa;
    text-decoration: none;
}

.back-link:hover {
    text-decoration: underline;
}
</style>