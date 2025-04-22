import Form from "./Form";

const LoginPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "1rem",
        backgroundColor: "#f0f0f0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "#2c3e50",
            margin: 0,
          }}
        >
          Sociopedia
        </h1>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >

        <p
          style={{
            fontSize: "1.2rem",
            color: "#7f8c8d",
            marginTop: "2rem", // Ensures space between the button and the text
          }}
        >
          Welcome to Sociopedia, the Social Media for Sociopaths!
        </p>

        <Form />
        
      </div>
    </div>
  );
};

export default LoginPage;
