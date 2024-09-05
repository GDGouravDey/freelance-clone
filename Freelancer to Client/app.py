from flask import Flask, request, jsonify, render_template
import PyPDF2
import re
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)

projects = {
    '1': {'title': 'Web Development', 'skills_required': ['JavaScript', 'Web Development'], 'budget': 1000},
    '2': {'title': 'Data Analysis', 'skills_required': ['Python', 'Data Analysis'], 'budget': 1200},
    '3': {'title': 'Machine Learning', 'skills_required': ['Machine Learning', 'Python'], 'budget': 1500},
    '4': {'title': 'Mobile App Development', 'skills_required': ['Android', 'Java', 'Kotlin'], 'budget': 2000},
    '5': {'title': 'Front-end Redesign', 'skills_required': ['HTML', 'CSS', 'JavaScript', 'React'], 'budget': 1300},
    '6': {'title': 'Database Optimization', 'skills_required': ['SQL', 'PostgreSQL'], 'budget': 1400},
    '7': {'title': 'AI Chatbot Development', 'skills_required': ['Python', 'NLP', 'Machine Learning'], 'budget': 2500},
    '8': {'title': 'E-commerce Website', 'skills_required': ['PHP', 'MySQL', 'JavaScript'], 'budget': 1600},
    '9': {'title': 'Data Engineering Pipeline', 'skills_required': ['Python', 'Apache Airflow', 'ETL'], 'budget': 1700},
    '10': {'title': 'Cybersecurity Audit', 'skills_required': ['Network Security', 'Penetration Testing'], 'budget': 2200},
    '11': {'title': 'Cloud Infrastructure Setup', 'skills_required': ['AWS', 'Docker', 'Kubernetes'], 'budget': 3000},
    '12': {'title': 'Blockchain Smart Contract', 'skills_required': ['Solidity', 'Ethereum'], 'budget': 4000},
    '13': {'title': 'SEO Optimization', 'skills_required': ['SEO', 'Marketing'], 'budget': 900},
    '14': {'title': 'Digital Marketing Campaign', 'skills_required': ['Google Ads', 'Facebook Marketing', 'SEO'], 'budget': 800},
    '15': {'title': 'Game Development', 'skills_required': ['Unity', 'C#'], 'budget': 3500},
    '16': {'title': 'API Development', 'skills_required': ['Node.js', 'Express', 'REST'], 'budget': 1100},
    '17': {'title': 'UI/UX Design', 'skills_required': ['Figma', 'Adobe XD', 'User Research'], 'budget': 1400},
    '18': {'title': 'Virtual Reality Experience', 'skills_required': ['Unity', 'VR', '3D Modeling'], 'budget': 2800},
    '19': {'title': 'Social Media Integration', 'skills_required': ['Social Media APIs', 'JavaScript'], 'budget': 1000},
    '20': {'title': 'Content Management System', 'skills_required': ['CMS', 'PHP', 'MySQL'], 'budget': 1500}
}

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return text

def extract_skills(text, skills):
    matched_skills = []
    text = preprocess_text(text)
    for skill in skills:
        skill_lower = skill.lower()
        if re.search(r'\b' + re.escape(skill_lower) + r'\b', text):
            matched_skills.append(skill)
    return matched_skills

def calculate_match_score(matched_skills, total_skills):
    match_percentage = (len(matched_skills) / total_skills) * 100
    return match_percentage

def create_pie_chart(match_percentage):
    labels = ['Matched Skills', 'Remaining Skills']
    sizes = [match_percentage, 100 - match_percentage]
    colors = ['#4CAF50', '#FF7043']
    explode = (0.05, 0)

    plt.figure(figsize=(7, 7))
    plt.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%', shadow=True, startangle=140)
    plt.axis('equal')
    plt.title('Skill Match Score')

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file and file.filename.endswith('.pdf'):
        extracted_text = extract_text_from_pdf(file)
        skills = request.form['skills'].split(',')
        skills = [skill.strip() for skill in skills]
        matched_skills = extract_skills(extracted_text, skills)
        missing_skills = list(set(skills) - set(matched_skills))
        match_score = calculate_match_score(matched_skills, len(skills))

        pie_chart_base64 = create_pie_chart(match_score)

        # Recommend projects based on extracted skills
        matching_projects = [
            info for pid, info in projects.items()
            if any(skill.lower() in [s.lower() for s in skills] for skill in info['skills_required'])
        ]
        matching_projects.sort(key=lambda x: x['budget'], reverse=True)

        return jsonify({
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "match_score": match_score,
            "pie_chart": pie_chart_base64,
            "projects": matching_projects
        })

    return jsonify({"error": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True)
