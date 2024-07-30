import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

function InterviewItemCard({ Interview }) {
  
    const router = useRouter();

    const onStart =()=>{
     router.push('/dashboard/interview/' +Interview?.mockId)
    }

    const onFeedback =()=>{
        router.push('/dashboard/interview/'+Interview?.mockId+ "/feedback")
    }
  
  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-primary'>{Interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-700'>{Interview?.jobExperience} Years of Experience</h2>
       <h2 className='text-xs text-gray-500'>Created At:{Interview.createdAt}</h2>
       
       <div className='flex justify-between mt-2 gap-5'>
       
       
       <Button size="sm" variant="outline" className = "w-full"
       onClick={onFeedback}
       >Feedback</Button>
       <Button size="sm" className="w-full"
       onClick={onStart}
       >Start</Button>
    </div>
    </div>
  );
}

export default InterviewItemCard;