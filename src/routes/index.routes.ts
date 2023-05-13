import express from "express";

import { authgRouter } from "./auth.routes";
import { blogRouter } from "./blog.routes";
import { commentRouter } from "./comments.routes";
import { postRouter } from "./post.routes";
import { secutityDeviceRouter } from "./security.devices.routes";
import { testingRouter } from "./testing.all-data.routes";
import { userRouter } from "./user.routes";

export const rootRouter = express.Router();

rootRouter.use('/testing/all-data', testingRouter);
rootRouter.use('/auth', authgRouter);
rootRouter.use('/security', secutityDeviceRouter);
rootRouter.use('/blogs', blogRouter);
rootRouter.use('/posts', postRouter);
rootRouter.use('/users', userRouter);
rootRouter.use('/comments', commentRouter);
