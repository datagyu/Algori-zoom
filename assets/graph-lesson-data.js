/* Strict, token-based input helpers for the small teaching examples. */
window.GraphLessonInput = text => {
  const tokens=text.trim().split(/\s+/);let i=0;
  const word=()=>{if(i>=tokens.length)throw Error('입력이 부족합니다. 입력 형식을 확인해 주세요.');return tokens[i++];};
  const number=(min,max,label)=>{const v=word();if(!/^-?\d+$/.test(v))throw Error(`${label}: 정수를 입력해 주세요.`);const n=Number(v);if(!Number.isSafeInteger(n)||n<min||n>max)throw Error(`${label}: ${min}~${max} 범위로 입력해 주세요.`);return n;};
  const count=number(1,5,'학습용 테스트케이스 수');
  return {word,number,count,end(){if(i!==tokens.length)throw Error('테스트케이스 뒤에 남는 입력값이 있습니다.');}};
};
