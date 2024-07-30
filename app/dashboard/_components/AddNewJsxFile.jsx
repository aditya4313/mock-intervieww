"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAI';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation'; 

function Addnewinterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExp, setJobExp] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const [error, setError] = useState('');
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    

    const InputPrompt = `Job Position: ${jobPosition}, job description: ${jobDesc}, years of Experience: ${jobExp}, Depends on job Position < job description & years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview question along with answer in JSON format, give us question and answer field on JSON`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const mockJsonResp = ( result.response.text()).replace('```json', '').replace('```', '');
      const parsedJsonResp = JSON.parse(mockJsonResp);
       
      setJsonResponse(mockJsonResp);


      console.log(parsedJsonResp);
      

      // console.log(result.response.text());

      if (parsedJsonResp) {
        const newMockId = uuidv4();
        const resp = await db.insert(MockInterview).values({
          mockId: newMockId,
          jsonMockResp: JSON.stringify(parsedJsonResp),
          jobPosition,
          jobExperience: jobExp,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY')
        }).returning({ mockId: MockInterview.mockId });



        console.log("Inserted ID:", resp);

        if(resp){
          setOpenDialog(false);
          router.push('/dashboard/interview/' + resp[0]?.mockId)
        }
      } else {
        console.log("ERROR: Parsed JSON response is empty");
      }
    }
     catch (error) {
      console.error("Error during submission:", error);
      setError("There was an error generating or inserting the interview data. Please try again.");
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Tell us more about your job Interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details about your job position/role, job description and years of experience</h2>

                  <div className='mt-7 my-2'>
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder='EX. Full Stack Developer'
                      required
                      value={jobPosition}
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label>Job Description/Tech Stack (In Short)</label>
                    <Textarea
                      placeholder='EX. React, Angular, NodeJS, MySql etc'
                      required
                      value={jobDesc}
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label>Years of experience</label>
                    <Input
                      placeholder='EX. 5'
                      max='50'
                      min='0'
                      type='number'
                      required
                      value={jobExp}
                      onChange={(event) => setJobExp(event.target.value)}
                    />
                  </div>
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type='button' variant='ghost' onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className='animate-spin' /> Generating from AI
                      </>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Addnewinterview;
