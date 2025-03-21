import "bootstrap/dist/css/bootstrap.css";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>Employee Tasks Management</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
