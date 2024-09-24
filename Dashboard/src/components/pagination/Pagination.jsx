import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, onPageChange }) => {
  return (
    <ReactPaginate
      previousLabel={"Previous"}
      nextLabel={"Next"}
      pageCount={pageCount}
      onPageChange={onPageChange}
      containerClassName={"flex gap-2"}
      pageClassName={"px-3 py-1 bg-gray-700 text-white rounded"}
      activeClassName={"bg-blue-500"}
      previousClassName={"px-3 py-1 bg-gray-700 text-white rounded"}
      nextClassName={"px-3 py-1 bg-gray-700 text-white rounded"}
      disabledClassName={"opacity-50"}
    />
  );
};

export default Pagination;
