import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import { Formik } from "formik";
import * as yup from "yup";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const registerSchema = yup.object().shape({
  firstName: yup.string().min(3).max(15).required("required"),
  lastName: yup.string().min(3).max(15).required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/\d/, "Password must contain a number")
    .required("Password is required"),
  confirm_password: yup.string()
    .required("required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
  twitter: yup.string().url("invalid URL").required("required"),
  linkedin: yup.string().url("invalid URL").required("required")
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/\d/, "Password must contain a number")
    .required("Password is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm_password: "",
  location: "",
  occupation: "",
  picture: "",
  twitter: "",
  linkedin: ""
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [displayerror, setdisplayerror] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const formData = new FormData();
    let imageUrl = null;
    for (let value in values) {
      if (value === "picture") {
        console.log("Hello world");
        const { url } = await fetch(`${API_URL}/posts/s3Url?contentType=${values[value].type}`).then(res => res.json());

        // posting image in S3
        await fetch(url, {
          method: "PUT",
          body: values[value]
        });
        // add this in the data
        imageUrl = url.split('?')[0] 
        formData.append("picturePath", imageUrl);
      }else{
        formData.append(value, values[value]);
      }
      
    }
    

    const savedUserResponse = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const loggedInResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
  
      if (loggedInResponse.status === 200) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate("/home");
      } else {
        // Handle the error, e.g., display an error message
       // console.error(loggedIn.msg || "Failed to login.");
        setdisplayerror(loggedIn.msg || "Failed to login.");
        // You could also display this error in your UI
      }
    } catch (err) {
      console.error("An error occurred during login:", err);
    }
  };  

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              maxWidth: "400px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            {isRegister && (
              <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    htmlFor="firstName"
                    style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    style={{
                      padding: "0.8rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {touched.firstName && errors.firstName && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    htmlFor="lastName"
                    style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    style={{
                      padding: "0.8rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {touched.lastName && errors.lastName && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {errors.lastName}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    htmlFor="location"
                    style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    style={{
                      padding: "0.8rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {touched.location && errors.location && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {errors.location}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    htmlFor="occupation"
                    style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
                  >
                    Occupation
                  </label>
                  <input
                    id="occupation"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    style={{
                      padding: "0.8rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {touched.occupation && errors.occupation && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {errors.occupation}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    htmlFor="picture"
                    style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
                  >
                    Picture
                  </label>
                  <input
                    id="picture"
                    type="file"
                    onChange={(e) => setFieldValue("picture", e.target.files[0])}
                    style={{
                      padding: "0.8rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {values.picture && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0.5rem",
                        color: "#555",
                      }}
                    >
                      <span style={{ marginRight: "0.5rem" }}>
                        {values.picture.name}
                      </span>
                      <EditOutlinedIcon style={{ fontSize: "1.2rem" }} />
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    htmlFor="twitter"
                    style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
                  >
                    Twitter Profile Link
                  </label>
                  <input
                    id="twitter"
                    type="url"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.twitter}
                    name="twitter"
                    style={{
                      padding: "0.8rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {touched.twitter && errors.twitter && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {errors.twitter}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    htmlFor="linkedin"
                    style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
                  >
                    LinkedIn Profile Link
                  </label>
                  <input
                    id="linkedin"
                    type="url"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.linkedin}
                    name="linkedin"
                    style={{
                      padding: "0.8rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {touched.linkedin && errors.linkedin && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {errors.linkedin}
                    </div>
                  )}
                </div>
              </>
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="email"
                style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                style={{
                  padding: "0.8rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              {touched.email && errors.email && (
                <div style={{ color: "red", marginTop: "0.5rem" }}>
                  {errors.email}
                </div>
              )}

            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="password"
                style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="off"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                style={{
                  padding: "0.8rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              {touched.password && errors.password && (
                <div style={{ color: "red", marginTop: "0.5rem" }}>
                  {errors.password}
                </div>
              )}

              {displayerror && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {displayerror}
                    </div>
              )}
            </div>

            {isRegister && (
              <> 
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label
                    htmlFor="confirm_password"
                    style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    autoComplete="off"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirm_password}
                    name="confirm_password"
                    style={{
                      padding: "0.8rem",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  {touched.confirm_password && errors.confirm_password && (
                    <div style={{ color: "red", marginTop: "0.5rem" }}>
                      {errors.confirm_password}
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              style={{
                padding: "0.8rem",
                backgroundColor: "#4CAF50",
                color: "#fff",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </button>
            <div
              style={{
                marginTop: "1rem",
                textAlign: "center",
                cursor: "pointer",
                color: "#007BFF",
              }}
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Form;
