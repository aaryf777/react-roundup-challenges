import { FirestoreSubmission } from '@/lib/firestore';
import { CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SubmissionsListProps {
  submissions: FirestoreSubmission[];
}

const SubmissionsList = ({ submissions }: SubmissionsListProps) => {
  if (submissions.length === 0) {
    return <div className="p-6 text-center">No submissions yet.</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">My Submissions</h2>
      <ul>
        {submissions.map(sub => (
          <li key={sub.id} className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
            <div>
              <div className="flex items-center font-semibold">
                {sub.status === 'accepted' ? (
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2 text-red-500" />
                )}
                <span className={`${sub.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
                  {sub.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(sub.submittedAt.toDate ? sub.submittedAt.toDate() : sub.submittedAt, { addSuffix: true })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{sub.points || 0} pts</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {sub.testCasesPassed}/{sub.totalTestCases} cases
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionsList;
