---
# Leave the homepage title empty to use the site title
title: ''
date: 2024-10-21
type: landing

sections:
  - block: markdown
    content:
      title: ''
      text: |
        <div style="text-align: center; margin: 30px auto 40px; max-width: 900px;">
          <a href="/papers/" style="display: inline-block; text-decoration: none;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 25px 50px;
                        border-radius: 15px;
                        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                        transition: transform 0.3s, box-shadow 0.3s;
                        cursor: pointer;"
                 onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 30px rgba(102, 126, 234, 0.4)';"
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(102, 126, 234, 0.3)';">
              <h2 style="color: white; margin: 0 0 10px 0; font-size: 2em; font-weight: 700;">
                📚 Research Paper Collection
              </h2>
              <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 1.1em;">
                Curated papers in Medical Imaging, 3D Reconstruction & Gaussian Splatting
              </p>
              <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 0.9em;">
                🤖 Auto-updated | 🔍 Smart filtering | 💬 AI summaries (Coming Soon)
              </p>
            </div>
          </a>
        </div>
    design:
      columns: '1'
      background:
        color: ''
      spacing:
        padding: ['20px', '0', '0', '0']
  - block: about.biography
    id: about
    content:
      title: Biography
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
  - block: skills
    content:
      title: Skills
      text: ''
      # Choose a user to display skills from (a folder name within `content/authors/`)
      username: admin
    design:
      columns: '1'
  - block: experience
    content:
      title: Experience
      # Date format for experience
      #   Refer to https://docs.hugoblox.com/customization/#date-format
      date_format: Jan 2006
      # Experiences.
      #   Add/remove as many `experience` items below as you like.
      #   Required fields are `title`, `company`, and `date_start`.
      #   Leave `date_end` empty if it's your current employer.
      #   Begin multi-line descriptions with YAML's `|2-` multi-line prefix.
      items:
        - title: PhD Candidate
          company: University of Science and Technology of China
          company_url: 'https://www.ustc.edu.cn/'
          company_logo: ''
          location: Hefei, China
          date_start: '2020-09-01'
          date_end: ''
          description: |2-
              Research focus on:

              * Medical image segmentation and analysis
              * Deep learning for computer vision
              * Transfer learning and domain adaptation
    design:
      columns: '2'
  - block: collection
    id: publications
    content:
      title: Recent Publications
      text: |-
        {{% callout note %}}
        Quickly discover relevant content by [filtering publications](./publication/).
        {{% /callout %}}
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      columns: '2'
      view: citation
  # - block: collection
  #   id: projects
  #   content:
  #     title: Projects
  #     filters:
  #       folders:
  #         - project
  #   design:
  #     columns: '2'
  #     view: card
  #     flip_alt_rows: false
  - block: contact
    id: contact
    content:
      title: Contact
      subtitle:
      text: |-
        Feel free to reach out to me for research collaboration, academic discussions, or any questions about my work.
      # Contact (add or remove contact options as necessary)
      email: 13621369872@163.com
      phone:
      appointment_url:
      address:
        street:
        city:
        region:
        postcode:
        country: China
        country_code: CN
      directions:
      office_hours:
      # Choose a map provider in `params.yaml` to show a map from these coordinates
      coordinates:
        latitude:
        longitude:
      contact_links: []
      # Automatically link email and phone or display as text?
      autolink: true
      # Email form provider
      form:
        provider: netlify
        formspree:
          id:
        netlify:
          # Enable CAPTCHA challenge to reduce spam?
          captcha: false
    design:
      columns: '2'
  - block: markdown
    id: visitor-map
    content:
      title: 'Visitor Map'
      subtitle: ''
      text: |
        {{< visitor-globe >}}

        <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 20px;">
          Thank you for visiting! This interactive globe shows visitor locations from around the world.
        </p>
    design:
      columns: '1'
      background:
        color: ''
---
