from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, OpenAI
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA

from dotenv import load_dotenv
from .load_data import load_data
import os
# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# FAISS directory path
file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../models/faiss_store_openai"))


def process_urls_and_create_faiss(urls, file_path):
    data = load_data(urls)
    print("inside process_urls_and_create_faiss")
    if not data:
        raise Exception("No data loaded from the provided URLs.")

    # Split and embed
    print("Split and embed")
    splitter = RecursiveCharacterTextSplitter(separators=['\n\n', '\n', '.', ','],chunk_size=1000, chunk_overlap=200)
    docs = splitter.split_documents(data)
    for i, doc in enumerate(docs):
        print(f"Doc {i} length: {len(doc.page_content)}")
    print(f"Number of documents to embed: {len(docs)}")
    print("Split done")
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    print("Embeddings done")
    try:
        sample_texts = [doc.page_content[:100] for doc in docs[:5]]
        test_embeddings = embeddings.embed_documents(sample_texts)
        print(f"Sample embeddings created successfully: {test_embeddings[:1]}")
    except Exception as e:
        print(f"Error in creating sample embeddings: {str(e)}")

    try:
        vectorstore = FAISS.from_documents(docs, embeddings)
        print("FAISS index created successfully!")
    except Exception as e:
        print(f"Error while creating FAISS index: {str(e)}")
    vectorstore = FAISS.from_documents(docs, embeddings)
    print("Saveing FAISS index to directory")
    print(f"FAISS will be saved to: {file_path}")
    # Save FAISS index to directory
    if not os.path.exists(file_path):
        os.makedirs(file_path)
        print(f"Created directory: {file_path}")
    else:
        print(f"Directory already exists: {file_path}")
    vectorstore.save_local(file_path)
    print("Saved FAISS index to directory")
    return "FAISS index created and saved successfully."


def query_faiss_index(question, file_path):
    if not os.path.exists(file_path):
        raise Exception("FAISS index not found. Please process URLs first.")

    print("Inside query_faiss_index... Loading FAISS index...")
    
    # Load FAISS index correctly
    vectorstore = FAISS.load_local(file_path, OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY))

    # Initialize LLM
    llm = OpenAI(temperature=0.9, max_tokens=500, openai_api_key=OPENAI_API_KEY)

    # Create the RetrievalQA chain
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",  # Use "stuff" for simple QA
        retriever=vectorstore.as_retriever(),
        return_source_documents=True,  # If you need sources
    )

    print("Running query...")

    # Run the query correctly
    result = chain.run(question)

    # If you need sources, use 'result["source_documents"]'
    return {"answer": result}