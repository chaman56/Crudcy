// app\practice\problems\[pid]\[pid].js

import { useRouter } from 'next/router';

function ProblemPage() {
  const router = useRouter();
  const pid = router.query.pid;

  return (
    <div>
      <p>Accessing parameter from the URL: {pid}</p>
    </div>
  );
}

export default ProblemPage;
