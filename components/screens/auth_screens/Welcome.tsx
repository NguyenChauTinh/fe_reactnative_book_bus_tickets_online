import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

// --- Định nghĩa màu sắc chủ đạo ---
const COLORS = {
  primaryBlue: '#007AFF', // Xanh dương chủ đạo
  white: '#FFFFFF', // Trắng chủ đạo
  accentYellow: '#FFD700', // Vàng (ít hơn)
  darkText: '#222222',
  lightText: '#FAFAFA',
  grayText: '#777777',
};

// --- Các ưu điểm để quảng cáo (chỉ dùng icon) ---
const FEATURES = [
  {
    icon: 'compass-outline', // Biểu tượng cho "Công nghệ"
    text: 'Công nghệ đặt vé thông minh',
  },
  {
    icon: 'people-outline', // Biểu tượng cho "Đội ngũ"
    text: 'Đội ngũ hỗ trợ chuyên nghiệp',
  },
  {
    icon: 'chatbubbles-outline', // Biểu tượng cho "Chatbot"
    text: 'Chatbot tư vấn 24/7',
  },
  {
    icon: 'flash-outline', // Biểu tượng cho "Nhanh"
    text: 'Đặt vé nhanh chóng, tiện lợi',
  },
  {
    icon: 'pricetag-outline', // Biểu tượng cho "Giá rẻ"
    text: 'Luôn có mức giá rẻ và ưu đãi',
  },
];

// --- Tạo component có thể animate bằng Animatable ---
const AnimatableTouchableOpacity =
  Animatable.createAnimatableComponent(TouchableOpacity);

const Welcome: React.FC = () => {
  const navigation = useNavigation();

  // State cho hiệu ứng chuyển đổi văn bản
  const [featureIndex, setFeatureIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current; // Giá trị opacity

  // Interval để thay đổi nội dung quảng cáo
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Mờ đi (Fade Out)
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // 0.5 giây
        useNativeDriver: true,
      }).start(() => {
        // 2. Thay đổi nội dung
        setFeatureIndex((prevIndex) => (prevIndex + 1) % FEATURES.length);

        // 3. Hiện ra (Fade In)
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500, // 0.5 giây
          useNativeDriver: true,
        }).start();
      });
    }, 3000); // Thay đổi mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [fadeAnim]);

  // Hàm xử lý khi nhấn nút
  const handleStart = () => {
    // @ts-ignore
    navigation.navigate('Login'); // Chuyển sang màn hình Login
  };

  const currentFeature = FEATURES[featureIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryBlue} />

      {/* --- Phần trên: Tiêu đề và Logo/Icon --- */}
      <View style={styles.headerContainer}>
        <Animatable.Text
          animation="fadeInDown"
          duration={1000}
          style={styles.brandName}
        >
          SmartBus
        </Animatable.Text>
        <Animatable.Text
          animation="fadeInDown"
          duration={1000}
          delay={200}
          style={styles.subTitle}
        >
          Hệ thống vé xe thông minh
        </Animatable.Text>
        <Animatable.View animation="bounceIn" duration={1500} delay={500}>
          <Ionicons name="bus" size={100} color={COLORS.accentYellow} />
        </Animatable.View>
      </View>

      {/* --- Phần giữa: Quảng cáo các tính năng --- */}
      <View style={styles.featuresContainer}>
        <Animated.View
          style={[
            styles.featureItem,
            {
              opacity: fadeAnim, // Áp dụng hiệu ứng mờ
            },
          ]}
        >
          {/* ** LOGIC MỚI: Chỉ hiển thị Icon ** */}
          <Ionicons
            name={currentFeature.icon as any}
            size={40} // Cho icon to hơn một chút
            color={COLORS.darkText}
          />
          <Text style={styles.featureText}>{currentFeature.text}</Text>
        </Animated.View>
      </View>

      {/* --- Phần dưới: Nút bắt đầu và Bản quyền --- */}
      <View style={styles.footerContainer}>
        <AnimatableTouchableOpacity
          animation="pulse" // Hiệu ứng nhấp nháy
          easing="ease-out"
          iterationCount="infinite" // Lặp lại vô hạn
          style={styles.startButton}
          onPress={handleStart}
        >
          <Text style={styles.startButtonText}>Bắt đầu ngay</Text>
          <Ionicons name="arrow-forward" size={22} color={COLORS.primaryBlue} />
        </AnimatableTouchableOpacity>

        {/* --- THÔNG TIN BẢN QUYỀN VÀ CỜ --- */}
        {/* (Bạn cần đảm bảo file 'flag.png' vẫn ở trong assets/images) */}
        <Animatable.View 
          style={styles.copyrightContainer}
          animation="fadeInUp"
          duration={1000}
          delay={500}
        >
          <Image 
            source={require('../../../assets/images/flag.png')} 
            style={styles.flagImage}
          />
          <Text style={styles.copyrightText}>
            © 2024 SmartBus. Đã đăng ký bản quyền.
          </Text>
        </Animatable.View>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue, // Nền xanh dương chủ đạo
  },
  headerContainer: {
    flex: 2, // Chiếm 2/4 không gian
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  brandName: {
    fontSize: 44,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 30,
  },
  featuresContainer: {
    flex: 1, // Chiếm 1/4 không gian
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white, // Nền trắng
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  featureItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.darkText,
    marginTop: 15,
    textAlign: 'center',
  },
  footerContainer: {
    flex: 1, // Chiếm 1/4 không gian
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentYellow, // Nút màu vàng
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: COLORS.accentYellow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue, // Chữ màu xanh
    marginRight: 10,
  },
  copyrightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25, // Tạo khoảng cách với nút
  },
  flagImage: {
    width: 24,
    height: 16, // Tỷ lệ chuẩn của cờ
    marginRight: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: COLORS.lightText, // Màu trắng nhạt
    opacity: 0.7,
  },
});

export default Welcome;