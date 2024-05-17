const apiUrl = "http://localhost:3000/users";


// Function to insert data
const insertData = () => {
  const fname = document.querySelector("#fullName").value;
  const memail = document.querySelector("#myemail").value;
  const mpassword = document.querySelector("#mypassword").value;

  const formData = {
    name: fname,
    email: memail,
    password: mpassword,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((newUserData) => {
      console.log("New User Data:", newUserData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Add event listener to register button
document.getElementById("register").addEventListener("click", insertData);
we