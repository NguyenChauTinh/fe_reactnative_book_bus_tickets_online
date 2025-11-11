import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export interface User {
  _id: string; 
  hoVaTen: string;
  email?: string;
  ngaySinh?: string;
  gioiTinh?: "Nam" | "Nữ" | "Khác";
  soDienThoai: string; 
  taiKhoanId: string; 
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean; 
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu là true

  // Kiểm tra AsyncStorage khi app khởi động
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken: string | null = null;
      let userData: User | null = null;

      try {
        userToken = await AsyncStorage.getItem("userToken");
        const userString = await AsyncStorage.getItem("userData");
        if (userString) {
          userData = JSON.parse(userString) as User;
        }

        if (userToken && userData) {
          setToken(userToken);
          setUser(userData);
        }
      } catch (e) {
        console.error("Lỗi khôi phục session:", e);
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (newToken: string, newUser: User) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem("userToken", newToken);
      await AsyncStorage.setItem("userData", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (e) {
      console.error("Lỗi lưu session đăng nhập:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error("Lỗi xóa session đăng xuất:", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});