
// asyncHandler 
const asyncHandler = (fn: Function) =>  (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);


export  {asyncHandler};

;