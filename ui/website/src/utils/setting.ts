type JumpTarget = 'blank' | 'self';

export const toggleJumpTarget = () => {
  const thisTarget = getJumpTarget();
  if (!thisTarget) {
    setJumpTarget('blank');
  }
  if (thisTarget === 'blank') {
    setJumpTarget('self');
  } else {
    setJumpTarget('blank');
  }

}

const setJumpTarget = (target: JumpTarget) => {
  window.localStorage.setItem('jumpTarget', target);
}

export const getJumpTarget = () => {
  return window.localStorage.getItem('jumpTarget') as JumpTarget;
}