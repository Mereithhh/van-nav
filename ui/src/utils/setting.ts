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


export const initServerJumpTargetConfig = (setting: any) => {
  if (!window.localStorage.getItem("initedServerJumpTarget")) {
    window.localStorage.setItem("initedServerJumpTarget", "true");
    if (setting.jumpTargetBlank === undefined || setting.jumpTargetBlank === undefined || setting.jumpTargetBlank=== true) {
      setJumpTarget("blank")
    } else {
      setJumpTarget("self")
    }
  }
}