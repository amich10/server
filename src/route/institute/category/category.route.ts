import { Router } from "express";
import Middleware from "../../../middleware/middleware";
import asyncErrorHandler from "../../../services/async.error";
import CategoryController from "../../../controller/institue/category/category.controller";


const categoryRouter:Router = Router();

categoryRouter
  .route("/")
  .post(
    Middleware.isLoggedIn,
    asyncErrorHandler(CategoryController.createCategory)
  )
  .get(
    Middleware.isLoggedIn,
    asyncErrorHandler(CategoryController.getAllCategories)
  );

categoryRouter
  .route("/:id")
  .get(
    Middleware.isLoggedIn,
    asyncErrorHandler(CategoryController.getSingleCategory)
  ).patch(Middleware.isLoggedIn,CategoryController.updateCategory)
  .delete(
    Middleware.isLoggedIn,
    asyncErrorHandler(CategoryController.deleteCategory)
  );

export default categoryRouter;
