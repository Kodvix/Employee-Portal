module.exports = {
  presets: [
    '@babel/preset-react'
  ],
  plugins: [
    process.env.NODE_ENV === 'development' && 'react-refresh/babel'
  ].filter(Boolean)
}; 