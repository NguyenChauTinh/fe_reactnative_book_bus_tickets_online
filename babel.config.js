module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Đây là dòng quan trọng nhất để sửa lỗi
      "react-native-reanimated/plugin",
    ],
  };
};
