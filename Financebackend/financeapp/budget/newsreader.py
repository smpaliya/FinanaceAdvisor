
import os
import streamlit as st
import pickle
import openai
import time
from langchain import OpenAI
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import UnstructuredURLLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from dotenv import load_dotenv
load_dotenv()

st.title("RockyBot: News Research Tool 📈")
st.sidebar.title("News Article URLs")

urls = []
for i in range(3):
    url = st.sidebar.text_input(f"URL {i+1}")
    urls.append(url)

process_url_clicked = st.sidebar.button("Process URLs")
file_path = "faiss_store_openai.pkl"

main_placeholder = st.empty()
openai.api_key = os.getenv("OPENAI_API_KEY")

llm = OpenAI(temperature=0.9, max_tokens=500, openai_api_key=openai.api_key)

if process_url_clicked:
    valid_urls = [url for url in urls if url.strip() != ""]
    if not valid_urls:
        st.error("Please enter at least one valid URL before processing!")
    else:
        # load data
        loader = UnstructuredURLLoader(urls=valid_urls)
        main_placeholder.text("Data Loading...Started...✅✅✅")
        
        # Try to load data
        try:
            data = loader.load()
            main_placeholder.text("Data loaded successfully! 📄✅")
            
            # split data
            text_splitter = RecursiveCharacterTextSplitter(
                separators=['\n\n', '\n', '.', ','],
                chunk_size=1000
            )
            main_placeholder.text("Text Splitter...Started...✅✅✅")
            docs = text_splitter.split_documents(data)
            
            # create embeddings and save it to FAISS index
            embeddings = OpenAIEmbeddings()
            vectorstore_openai = FAISS.from_documents(docs, embeddings)
            main_placeholder.text("Embedding Vector Started Building...✅✅✅")
            
            # Save the FAISS index
            with open(file_path, "wb") as f:
                pickle.dump(vectorstore_openai, f)
            main_placeholder.text("FAISS index saved successfully! 🎉✅")

        except Exception as e:
            st.error(f"Error loading data: {str(e)}")

query = main_placeholder.text_input("Question: ")
if query:
    if os.path.exists(file_path):
        with open(file_path, "rb") as f:
            vectorstore = pickle.load(f)
            chain = RetrievalQAWithSourcesChain.from_llm(llm=llm, retriever=vectorstore.as_retriever())
            result = chain({"question": query}, return_only_outputs=True)
            
            st.header("Answer")
            st.write(result["answer"])
            
            sources = result.get("sources", "")
            if sources:
                st.subheader("Sources:")
                sources_list = sources.split("\n")
                for source in sources_list:
                    st.write(source)
    else:
        st.error("No FAISS index found. Please process URLs first!")
