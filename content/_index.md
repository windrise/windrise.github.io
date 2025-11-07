---
# Leave the homepage title empty to use the site title
title: ''
date: 2024-10-21
type: landing

sections:
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
      text: |-
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mapmyvisitors.com/web/1bvjp" title="Visit tracker">
            <img src="https://mapmyvisitors.com/map.png?d=jP858m8WAgpTAuXlcxqj5BAL0dTRzLxiZ9iRQRvULck&cl=ffffff" style="border: 1px solid #ddd; border-radius: 8px; max-width: 100%;" />
          </a>
        </div>
        <p style="text-align: center; color: #666; font-size: 0.9em; margin-top: 10px;">
          Thank you for visiting! This map shows visitor locations from around the world.
        </p>
    design:
      columns: '1'
      background:
        color: ''
---
