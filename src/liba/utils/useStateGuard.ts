export const useStateGuard = (componentInstance: any, hookCallsCountOnFirstRender: number) => {
  if (
    componentInstance.status !== 'first-rendering'
    && componentInstance.useStateCallIndex > hookCallsCountOnFirstRender - 1
  ) {
    return true;
  }

  return false;
};
