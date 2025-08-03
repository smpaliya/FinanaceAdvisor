from langchain_community.document_loaders import UnstructuredURLLoader


def load_data(urls):
    loader = UnstructuredURLLoader(urls)
    data = loader.load()
    print(f"Data loaded: {data}")
    return data
