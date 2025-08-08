import { IExtendedRequest } from "../../../interfaces/interfaces";
import { Request, Response } from "express";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";

class CategoryController {
  static createCategory = async (req: IExtendedRequest, res: Response) => {
    try {
      const instituteNumber = req.user?.currentInstituteNumber;
      const { categoryName, categoryDescription } = req.body;

      if (!categoryName || !categoryDescription) {
        return res.status(400).json({
          message: "Please provide all the category details",
        });
      }
      const result = await sequelize.query(
        `INSERT INTO category_${instituteNumber} (categoryName, categoryDescription) VALUES (?, ?)`,
        {
          replacements: [categoryName, categoryDescription],
          type: QueryTypes.INSERT,
        }
      );
      const[ categoryData]:{id:string,created_at:Date}[] = await sequelize.query(`SELECT id,created_at from category_${instituteNumber} WHERE categoryName =?`, {
        replacements: [categoryName],
        type: QueryTypes.SELECT
      })
      console.log(categoryData)
      res.status(201).json({
        message: "Category created successfully",
        data: {
          categoryName,
          categoryDescription,
          id: categoryData.id,
          created_at:categoryData.created_at
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating category",
      });
    }
  };

  static updateCategory = async (
    req: IExtendedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const instituteNumber = req.user?.currentInstituteNumber;
      const categoryId = req.params.id;
      const { categoryName, categoryDescription } = req.body;

      if (!categoryName || !categoryDescription) {
        res.status(400).json({
          message:
            "Please provide both the categoryName and categoryDescription",
        });
        return;
      }

      // Check if category exists
      const category = await sequelize.query(
        `SELECT * FROM category_${instituteNumber} WHERE id = ?`,
        {
          replacements: [categoryId],
          type: QueryTypes.SELECT,
        }
      );

      if (category.length === 0) {
        res.status(404).json({
          message: "Category not found",
        });
        return;
      }

      // Update category
      await sequelize.query(
        `UPDATE category_${instituteNumber} SET categoryName = ?, categoryDescription = ? WHERE id = ?`,
        {
          replacements: [categoryName, categoryDescription, categoryId],
          type: QueryTypes.UPDATE,
        }
      );

      res.status(200).json({
        message: "Category updated successfully",
      });
    } catch (exception) {
      console.log(exception);
      res.status(500).json({
        message: "Error updating category.",
      });
    }
  };

  static getAllCategories = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    try {
      const categories = await sequelize.query(
        `SELECT * FROM category_${instituteNumber}`,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.status(200).json({
        message: "All categories fetched",
        data: categories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error fetching categories",
      });
    }
  };

  static getSingleCategory = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const categoryId = req.params.id;

    try {
      const category = await sequelize.query(
        `SELECT * FROM category_${instituteNumber} WHERE id = ?`,
        {
          replacements: [categoryId],
          type: QueryTypes.SELECT,
        }
      );

      if (category.length === 0) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      res.status(200).json({
        message: "Category fetched",
        data: category,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error fetching category",
      });
    }
  };

  static deleteCategory = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber;
    const categoryId = req.params.id;

    try {
      const category = await sequelize.query(
        `SELECT * FROM category_${instituteNumber} WHERE id = ?`,
        {
          replacements: [categoryId],
          type: QueryTypes.SELECT,
        }
      );
      if (category.length === 0) {
        return res.status(404).json({
          message: "Category does not exist",
        });
      }

      await sequelize.query(
        `DELETE FROM category_${instituteNumber} WHERE id = ?`,
        {
          replacements: [categoryId],
        }
      );

      res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error deleting category",
      });
    }
  };
}

export default CategoryController;
