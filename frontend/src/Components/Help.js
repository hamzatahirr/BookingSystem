import React, { useState, useCallback } from "react";

export default function Help() {
  const [formData, setFormData] = useState({
    subject: "",
    body: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.body) newErrors.body = "Message is required";
    return newErrors;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formErrors = validate();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setSuccessMessage("");
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      const userEmail = sessionStorage.getItem("email") || "NoEmailProvided";

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
    <div style={{
      minHeight: "80vh",
      backgroundColor: "#f5f6fa",
      padding: "40px 20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "700px",
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        overflow: "hidden"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #483f19 0%, #6b5d2e 100%)",
          padding: "30px",
          textAlign: "center"
        }}>
          <h1 style={{ color: "#fff", margin: "0 0 10px 0" }}>Need Help?</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>Send a message to the admin</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "30px" }}>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500", fontSize: "16px" }}>
              Subject
            </label>
            <textarea
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              rows="2"
              style={{
                width: "100%",
                padding: "12px 15px",
                border: errors.subject ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box"
              }}
            ></textarea>
            {errors.subject && <p style={{ color: "#dc3545", fontSize: "13px", marginTop: "5px" }}>{errors.subject}</p>}
          </div>
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#333", fontWeight: "500", fontSize: "16px" }}>
              Message
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows="8"
              style={{
                width: "100%",
                padding: "12px 15px",
                border: errors.body ? "1px solid #dc3545" : "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box"
              }}
            ></textarea>
            {errors.body && <p style={{ color: "#dc3545", fontSize: "13px", marginTop: "5px" }}>{errors.body}</p>}
          </div>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "14px 40px",
                backgroundColor: isSubmitting ? "#888" : "#483f19",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "background-color 0.2s"
              }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
          {successMessage && (
            <p style={{ 
              textAlign: "center", 
              marginTop: "20px", 
              padding: "12px", 
              borderRadius: "8px",
              backgroundColor: successMessage.includes("Failed") ? "#f8d7da" : "#d4edda",
              color: successMessage.includes("Failed") ? "#721c24" : "#155724"
            }}>
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
