import { useState } from "react";

import { Meta, StoryObj } from "@storybook/react";

import { TableColumn } from "@/interfaces/tableColumn";

import DataTable from "./dataTable";

const meta: Meta<typeof DataTable> = {
  title: "Tables/DataTable",
  component: DataTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DataTable>;

const sampleData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
  description: `Description for Item ${index + 1}`,
}));

const columns: TableColumn[] = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "description", label: "Description", minWidth: 150 },
];

export const Default: Story = {
  render: function DefaultStory(args) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const handleChangePage = (page: number) => setCurrentPage(page);
    const handleChangePageSize = (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    };

    return (
      <DataTable
        {...args}
        data={sampleData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        count={sampleData.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onChangePage={handleChangePage}
        onChangePageSize={handleChangePageSize}
        transformKey={(item) => item.id.toString()}
      />
    );
  },
};

export const Loading: Story = {
  render: function LoadingStory(args) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return (
      <DataTable
        {...args}
        data={[]}
        columns={columns}
        count={sampleData.length}
        currentPage={currentPage}
        pageSize={pageSize}
        loading={true}
        onChangePage={(page) => setCurrentPage(page)}
        onChangePageSize={(size) => setPageSize(size)}
        transformKey={(item) => (item as { id: number }).id.toString()}
      />
    );
  },
};

export const EditableDeletableRows: Story = {
  render: function EditDeleteStory(args) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const handleChangePage = (page: number) => setCurrentPage(page);
    const handleChangePageSize = (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    };

    const editItem = (item: { id: number; name: string; description: string }) => {
      alert(`Editing item: ${JSON.stringify(item)}`);
    };

    const deleteItem = async (item: { id: number; name: string; description: string }) => {
      alert(`Deleting item: ${JSON.stringify(item)}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    return (
      <DataTable
        {...args}
        data={sampleData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        columns={columns}
        count={sampleData.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onChangePage={handleChangePage}
        onChangePageSize={handleChangePageSize}
        editItem={editItem}
        deleteItem={deleteItem}
        transformKey={(item) => item.id.toString()}
      />
    );
  },
};
