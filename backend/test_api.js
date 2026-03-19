const body = JSON.stringify({
  title: "Math Syllabus",
  description: "Algebra, Linear Equations, Quadratic Equations, Probability, Statistics"
});

fetch("http://localhost:5000/api/syllabus", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body
})
.then(async res => {
  const text = await res.text();
  console.log("---BEGIN---");
  console.log("STATUS_CODE: " + res.status);
  console.log("BODY: " + text);
  console.log("---END---");
})
.catch(err => console.error("ERROR:", err));
