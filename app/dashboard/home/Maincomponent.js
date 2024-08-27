function GradeCard({ data, periodNumber, setCurrentView }) {
  const router = useRouter();
  return (
    <div
      className="w-25 h-25 border-blue-600 border-2 p-6 rounded-2xl cursor-pointer"
      onClick={() => setCurrentView(`${data.courseCode}${periodNumber}`)}
    ></div>
  );
}
