import { ChangeEvent, useState } from 'react';
import { Button } from '@mono/ui';
import { add } from '@mono/utils';

function App() {
  const [nums, setNums] = useState({
    a: '',
    b: '',
  });

  const handleNumChange =
    (key: keyof typeof nums) => (e: ChangeEvent<HTMLInputElement>) => {
      setNums((prevNums) => ({
        ...prevNums,
        [key]: e.target.value,
      }));
    };

  return (
    <>
      <input type="text" value={nums.a} onChange={handleNumChange('a')} />
      <input type="text" value={nums.b} onChange={handleNumChange('b')} />
      <Button
        onClick={() => {
          console.log(add(Number(nums.a), Number(nums.b)));
        }}
      >
        Add
      </Button>
    </>
  );
}

export default App;
