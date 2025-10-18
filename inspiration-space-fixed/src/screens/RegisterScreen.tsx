import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface RegisterScreenProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({
  onRegister,
  onNavigateToLogin,
}: RegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = () => {
    if (!phone.trim()) {
      Alert.alert('错误', '请输入手机号');
      return;
    }
    
    // Simulate sending verification code
    setCodeSent(true);
    Alert.alert('成功', '验证码已发送');
  };

  const handleRegister = () => {
    if (!username.trim() || !phone.trim() || !verificationCode.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('错误', '密码不匹配');
      return;
    }
    
    // Simple validation for demo
    onRegister();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <View style={styles.icon} />
          </View>
          <Text style={styles.title}>创建你的灵感库</Text>
          <Text style={styles.subtitle}>开启你的灵感之旅</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="用户名"
            placeholderTextColor={Colors.placeholder.light}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <View style={styles.phoneContainer}>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder="手机号"
              placeholderTextColor={Colors.placeholder.light}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.codeButton}
              onPress={handleSendCode}
              disabled={codeSent}
            >
              <Text style={styles.codeButtonText}>
                {codeSent ? '已发送' : '获取验证码'}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="验证码"
            placeholderTextColor={Colors.placeholder.light}
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="密码"
            placeholderTextColor={Colors.placeholder.light}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="确认密码"
            placeholderTextColor={Colors.placeholder.light}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>注册</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            已有账号？{' '}
            <Text style={styles.linkText} onPress={onNavigateToLogin}>
              去登录
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.foreground.light,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.subtle.light,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 56,
    backgroundColor: Colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.foreground.light,
  },
  phoneContainer: {
    position: 'relative',
  },
  phoneInput: {
    paddingRight: 120,
  },
  codeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    bottom: 8,
    paddingHorizontal: 12,
    backgroundColor: `${Colors.primary}33`,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  registerButton: {
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.subtle.light,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '500',
  },
});