import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllProductsShop,
  getProductsById,
  updateProduct,
} from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import Loader from "../Layout/Loader";
import { RxCross1 } from "react-icons/rx";
import { backend_url } from "../../server";
import { toast } from "react-toastify";
const AllProducts = () => {
  const { productDetail, products, isLoading } = useSelector(
    (state) => state.products
  );
  const { seller } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [productid, setProductId] = useState("");

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  useEffect(() => {
    if (productDetail) {
      const {
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        images,
      } = productDetail[0];

      setImages(images);
      setName(name);
      setDescription(description);
      setCategory(category);
      setTags(tags);
      setOriginalPrice(originalPrice);
      setDiscountPrice(discountPrice);
      setStock(stock);
    }
  }, [productDetail]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

  const handleEdit = (id) => {
    setProductId(id);
    dispatch(getProductsById(id));
    setOpen(true);
  };
  // const handleImageChange = (e) => {
  //   e.preventDefault();

  //   let files = Array.from(e.target.files);
  //   setImages((prevImages) => [...prevImages, ...files]);
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
    };
    dispatch(updateProduct(payload, productid));
    setOpen(false);
    navigate("/dashboard");
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Edit",
      flex: 0.8,
      minWidth: 50,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleEdit(params.id)}>
              <AiOutlineEdit size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            BorderStyle="None"
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[90vh] bg-white rounded-md shadow p-4 overflow-y-scroll	">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Update Product Details
                </h5>

                <form onSubmit={handleSubmit}>
                  <br />
                  <div>
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your product name..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      cols="30"
                      required
                      rows="8"
                      type="text"
                      name="description"
                      value={description}
                      className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter your product description..."
                    ></textarea>
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Choose a category">
                        Choose a category
                      </option>
                      {categoriesData &&
                        categoriesData.map((i) => (
                          <option value={i.title} key={i.title}>
                            {i.title}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={tags}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Enter your product tags..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Original Price</label>
                    <input
                      type="number"
                      name="price"
                      value={originalPrice}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="Enter your product price..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Price (With Discount){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={discountPrice}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="Enter your product price with discount..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Product Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={stock}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Enter your product stock..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Product Images <span className="text-red-500">*</span>
                    </label>
                    {/*
                    <input
                      type="file"
                      name=""
                      id="upload"
                      className="hidden"
                      multiple
                      onChange={handleImageChange}
                    /> */}
                    <div className="w-full flex items-center flex-wrap">
                      {/* <label htmlFor="upload">
                        <AiOutlinePlusCircle
                          size={30}
                          className="mt-3"
                          color="#555"
                        />
                      </label> */}
                      {images &&
                        images.map((i, ind) => {
                          return (
                            <div className="d-flex text-align-center ,justify-content-center">
                              <img
                                src={`${backend_url}${i}`}
                                key={i}
                                alt=""
                                className="h-[120px] w-[120px] object-cover m-2"
                              />
                            </div>
                          );
                        })}
                    </div>
                    <br />
                    <div>
                      <input
                        type="submit"
                        value="Update"
                        className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllProducts;
