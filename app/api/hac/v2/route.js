export async function GET() {
  return Response.json({
    info: "Welcome to GradeMate Backend API! This is what backs our web application and our mobile application.",
    status: "working",
  });
}
