export const useEffectGuard = (componentInstance: any, hookCallsCountOnFirstRender: number) => {
  if (
    componentInstance.status !== 'first-rendering'
    && componentInstance.useEffectCallIndex > hookCallsCountOnFirstRender - 1
  ) {
    return true;
  }

  return false;
};
