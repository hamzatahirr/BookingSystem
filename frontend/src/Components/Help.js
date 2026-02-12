import React, { useState, useCallback } from "react";
import auth_bg from "../Assets/Owner_Auth_Bg.png";

export default function Help() {
  const [formData, setFormData] = useState({
    subject: "",
    body: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = "Purpose (Subject) is required";
    if (!formData.body) newErrors.body = "body (Body) is required";
    return newErrors;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formErrors = validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setSuccessMessage(""); // Clear success message if errors exist
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      const userEmail = sessionStorage.getItem("email") || "NoEmailProvided";

      // Append the email to the subject
      const updatedPayload = {
        ...formData,
        subject: `Ground Owner Portal: \n${formData.subject} - ${userEmail}`,
      };

      try {
        const response = await fetch(process.env.REACT_APP_OWNER_HELP, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload),
        });

        if (!response.ok) {
          throw new Error("Failed to send the message. Please try again.");
        }

        const data = await response.json();
        console.log("Response from backend:", data); // Optional: For debugging

        setSuccessMessage("Your message has been sent to the admin!");
        setFormData({
          subject: "",
          body: "",
        });
      } catch (error) {
        console.error("Error notifying admin:", error);
        setSuccessMessage("Failed to send your message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return (
    <>
      <div style={{ backgroundImage: `url(${auth_bg})` }}>
        <div className="container d-flex-flex-column align-items-center py-5">
          <h1 className="text-center" style={{ color: "rgb(0 136 203)" }}>
            Need Help?
          </h1>
          <h1 className="text-center pb-3" style={{ color: "rgb(0 136 203)" }}>
            Send body to Admin
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                className="form-label"
                style={{ color: "rgb(0 136 203)", fontSize: "25px" }}
              >
                Subject:
              </label>
              <textarea
                type="text"
                className="form-control border-3 cus_css"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                rows="1"
                placeholder=""
              ></textarea>
              {errors.subject && <p className="error-text">{errors.subject}</p>}
            </div>
            <div className="mb-3">
              <label
                className="form-label"
                style={{ color: "rgb(0 136 203)", fontSize: "25px" }}
              >
                Message:
              </label>
              <textarea
                className="form-control border-3"
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows="14"
                placeholder=""
              ></textarea>
              {errors.body && <p className="error-text">{errors.body}</p>}
            </div>
            <div className="submit-button-container pt-5">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
            {successMessage && <p className="success-text">{successMessage}</p>}
          </form>
        </div>
      </div>
    </>
  );
}
